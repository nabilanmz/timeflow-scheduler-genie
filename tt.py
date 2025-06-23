import csv
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple, Set
from collections import defaultdict
import random
import numpy as np
from deap import base, creator, tools, algorithms
from datetime import time, datetime, timedelta

# Initialize DEAP
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

# Constants
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
MAX_CONSECUTIVE_CLASSES = 2  # Maximum preferred consecutive classes per day
IDEAL_GAP = timedelta(hours=1)  # 1 hour gap is ideal
MAX_GAP = timedelta(hours=2)  # More than 2 hours gap is not preferred


@dataclass
class Class:
    code: str
    course: str
    activity: str  # "Lecture" or "Tutorial"
    section: str
    days: str
    start_time: time
    end_time: time
    venue: str
    tied_to: List[str]  # ### NEW ###
    lecturer: str

    @property
    def duration(self) -> int:
        """Calculate duration in minutes"""
        start = datetime.combine(datetime.today(), self.start_time)
        end = datetime.combine(datetime.today(), self.end_time)
        return int((end - start).total_seconds() / 60)

    @property
    def time_tuple(self) -> Tuple[datetime, datetime]:
        """Return start and end as datetime objects for comparison"""
        today = datetime.today()
        return (
            datetime.combine(today, self.start_time),
            datetime.combine(today, self.end_time),
        )


def load_classes_from_csv(filename: str) -> List[Class]:
    """Load classes from CSV file, including the new 'Tied To' column."""
    classes = []
    with open(filename, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                # (Your existing time parsing logic is good, keep it)
                start_time = (
                    datetime.strptime(row["Start Time"], "%I:%M %p").time()
                    if "AM" in row["Start Time"] or "PM" in row["Start Time"]
                    else datetime.strptime(row["Start Time"], "%H:%M").time()
                )
                end_time = (
                    datetime.strptime(row["End Time"], "%I:%M %p").time()
                    if "AM" in row["End Time"] or "PM" in row["End Time"]
                    else datetime.strptime(row["End Time"], "%H:%M").time()
                )

                # ### NEW ###: Parse the 'Tied To' column
                tied_to_str = row.get("Tied To", "")
                tied_to_list = [s.strip() for s in tied_to_str.split(",") if s.strip()]

                classes.append(
                    Class(
                        code=row["Code"],
                        course=row["Course"],
                        activity=row["Activity"],
                        section=row["Section"],
                        days=row["Days"],
                        start_time=start_time,
                        end_time=end_time,
                        venue=row["Venue"],
                        tied_to=tied_to_list,  # ### NEW ###
                        lecturer=row["Lecturer"] if row["Lecturer"] else "Not Assigned",
                    )
                )
            except (ValueError, KeyError) as e:
                print(f"Skipping row due to error: {e} in row {row}")
                continue
    return classes


def group_classes_by_section(classes: List[Class]) -> Dict[str, Dict[str, List[Class]]]:
    """Group classes by course and section"""
    section_groups = defaultdict(lambda: defaultdict(list))
    for cls in classes:
        section_groups[cls.course][f"{cls.activity}_{cls.section}"].append(cls)
    return section_groups


@dataclass
class ScheduledClass:
    class_obj: Class
    day: str
    start_time: time
    end_time: time


class Timetable:
    def __init__(self):
        self.schedule = {day: [] for day in DAYS}
        self.scheduled_classes = []

    def can_add_section(self, section_classes: List[Class]) -> bool:
        """Check if we can add all classes in this section without clashes."""
        # This function now only needs to check for time clashes, as the GA
        # structure handles the one-lecture-per-course logic.
        for cls in section_classes:
            # Check time conflicts
            for existing in self.schedule[cls.days]:
                # A clash occurs if the new class starts before the existing one ends
                # AND the new class ends after the existing one starts.
                if (
                    cls.start_time < existing.end_time
                    and cls.end_time > existing.start_time
                ):
                    return False
        return True

    def add_section(self, section_classes: List[Class]):
        """Add all classes in a section. Assumes can_add_section was checked."""
        for cls in section_classes:
            sc = ScheduledClass(
                class_obj=cls,
                day=cls.days,
                start_time=cls.start_time,
                end_time=cls.end_time,
            )
            self.schedule[cls.days].append(sc)
            # Sort the day's schedule by start time after adding
            self.schedule[cls.days].sort(key=lambda x: x.start_time)
            self.scheduled_classes.append(sc)

    # All other Timetable methods (get_utilized_days, get_consecutive_days_score, etc.)
    # remain the same. The meets_requirements method is no longer needed.

    def get_utilized_days(self) -> int:
        return sum(1 for day in DAYS if self.schedule[day])

    def get_consecutive_days_score(self) -> float:
        """Calculate score based on consecutive days used"""
        days_used = [day for day in DAYS if self.schedule[day]]
        if not days_used:
            return 0

        # Calculate longest streak of consecutive days
        max_streak = current_streak = 1
        for i in range(1, len(days_used)):
            if DAYS.index(days_used[i]) == DAYS.index(days_used[i - 1]) + 1:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 1

        return max_streak / len(DAYS)  # Normalized score

    def get_day_gaps_score(self, day: str) -> float:
        """Calculate score based on gaps between classes on a single day"""
        day_classes = sorted(self.schedule[day], key=lambda x: x.start_time)
        if len(day_classes) < 2:
            return 1.0  # No gaps if only one class

        total_gap_score = 0
        consecutive_count = 1

        for i in range(1, len(day_classes)):
            prev_end = datetime.combine(datetime.today(), day_classes[i - 1].end_time)
            curr_start = datetime.combine(datetime.today(), day_classes[i].start_time)
            gap = curr_start - prev_end

            if gap <= timedelta(0):
                consecutive_count += 1
                continue  # No gap or overlap
            elif gap <= IDEAL_GAP:
                total_gap_score += 1.0  # Perfect gap
            elif gap <= MAX_GAP:
                total_gap_score += 0.5  # Acceptable gap
            else:
                total_gap_score += 0.1  # Too long gap

            consecutive_count = 1

        # Penalize too many consecutive classes
        if consecutive_count > MAX_CONSECUTIVE_CLASSES:
            total_gap_score *= 0.7  # Reduce score for too many consecutive classes

        return total_gap_score / (len(day_classes) - 1) if len(day_classes) > 1 else 1.0

    def get_scheduled_courses(self) -> Set[str]:
        return {sc.class_obj.course for sc in self.scheduled_classes}

    def meets_requirements(self, required_courses: List[str]) -> bool:
        """Check if all required courses are properly scheduled"""
        for course in required_courses:
            has_lecture = any(
                s.startswith("Lecture") for s in self.scheduled_sections[course]
            )
            has_tutorial = any(
                s.startswith("Tutorial") for s in self.scheduled_sections[course]
            )

            # Check if course has at least one lecture (if available)
            if any(
                s.startswith("Lecture") for s in self.section_groups.get(course, {})
            ):
                if not has_lecture:
                    return False

            # Check if course has at least one tutorial (if available)
            if any(
                s.startswith("Tutorial") for s in self.section_groups.get(course, {})
            ):
                if not has_tutorial:
                    return False

        return True


### REWRITTEN CLASS ###
class TimetableGenerator:
    def __init__(self, classes: List[Class], user_preferences: dict):
        self.classes = classes
        self.user_preferences = user_preferences
        self.enforce_ties = self.user_preferences.get(
            "enforce_ties", True
        )  # Default to True
        self.section_groups = group_classes_by_section(classes)
        self.gene_map = []
        self.setup_deap()

    def setup_deap(self):
        """Sets up DEAP based on whether ties are enforced."""
        self.toolbox = base.Toolbox()
        gene_upper_bounds = []

        if self.enforce_ties:
            print("\nSetting up GA with ENFORCED lecture-tutorial ties.")
            # Gene map for tied sections: (course, [ (lecture_section, [tied_tutorial_1, ...]), ... ])
            for course in self.user_preferences["courses"]:
                if course not in self.section_groups:
                    continue

                course_lectures = sorted(
                    [
                        sc
                        for sk, sc in self.section_groups[course].items()
                        if sk.startswith("Lecture")
                    ],
                    key=lambda s: s[0].section,
                )

                if not course_lectures:
                    continue

                lecture_tutorial_pairs = []
                max_tied_tutorials = 0
                for lect_section_group in course_lectures:
                    # Find all tutorial sections tied to this lecture
                    tied_tutorial_names = lect_section_group[0].tied_to

                    tied_tutorials = []
                    for tut_name in tied_tutorial_names:
                        tut_key = f"Tutorial_{tut_name}"
                        if tut_key in self.section_groups[course]:
                            tied_tutorials.append(self.section_groups[course][tut_key])

                    if tied_tutorials:
                        lecture_tutorial_pairs.append(
                            (lect_section_group, tied_tutorials)
                        )
                        if len(tied_tutorials) > max_tied_tutorials:
                            max_tied_tutorials = len(tied_tutorials)

                if lecture_tutorial_pairs:
                    self.gene_map.append(
                        {
                            "type": "tied_course",
                            "course": course,
                            "pairs": lecture_tutorial_pairs,
                        }
                    )
                    # Gene 1: choice of lecture. Gene 2: choice of tutorial from the tied list.
                    gene_upper_bounds.append(len(lecture_tutorial_pairs) - 1)
                    gene_upper_bounds.append(
                        max_tied_tutorials - 1 if max_tied_tutorials > 0 else 0
                    )

        else:  # Ties are NOT enforced (lecturer view)
            print("\nSetting up GA with INDEPENDENT lecture and tutorial choices.")
            for course in self.user_preferences["courses"]:
                if course not in self.section_groups:
                    continue

                lectures = [
                    sc
                    for sk, sc in self.section_groups[course].items()
                    if sk.startswith("Lecture")
                ]
                tutorials = [
                    sc
                    for sk, sc in self.section_groups[course].items()
                    if sk.startswith("Tutorial")
                ]

                if lectures:
                    self.gene_map.append(
                        {
                            "type": "independent_activity",
                            "activity": "Lecture",
                            "course": course,
                            "sections": lectures,
                        }
                    )
                    gene_upper_bounds.append(len(lectures) - 1)
                if tutorials:
                    self.gene_map.append(
                        {
                            "type": "independent_activity",
                            "activity": "Tutorial",
                            "course": course,
                            "sections": tutorials,
                        }
                    )
                    gene_upper_bounds.append(len(tutorials) - 1)

        if not self.gene_map:
            raise ValueError(
                "No valid sections found for the selected courses with the chosen constraints."
            )

        self.toolbox.register(
            "indices",
            lambda bounds: [random.randint(0, b) for b in bounds],
            gene_upper_bounds,
        )
        self.toolbox.register(
            "individual", tools.initIterate, creator.Individual, self.toolbox.indices
        )
        self.toolbox.register(
            "population", tools.initRepeat, list, self.toolbox.individual
        )

        self.toolbox.register("evaluate", self.evaluate)
        self.toolbox.register("mate", tools.cxUniform, indpb=0.5)
        self.toolbox.register(
            "mutate",
            tools.mutUniformInt,
            low=[0] * len(gene_upper_bounds),
            up=gene_upper_bounds,
            indpb=0.1,
        )
        self.toolbox.register("select", tools.selTournament, tournsize=3)

    # In tt.py, replace your existing evaluate method with this one.

    def evaluate(self, individual: List[int]) -> Tuple[float,]:
        # ### THIS IS THE METHOD TO REPLACE ###
        timetable = Timetable()

        # --- Decode the individual (your existing logic is perfect) ---
        sections_to_schedule = []
        if self.enforce_ties:
            gene_idx = 0
            for map_item in self.gene_map:
                lecture_choice, tutorial_choice = (
                    individual[gene_idx],
                    individual[gene_idx + 1],
                )
                chosen_pair = map_item["pairs"][lecture_choice]
                sections_to_schedule.append(chosen_pair[0])
                tied_tutorials = chosen_pair[1]
                if tied_tutorials:
                    sections_to_schedule.append(
                        tied_tutorials[tutorial_choice % len(tied_tutorials)]
                    )
                gene_idx += 2
        else:
            for i, map_item in enumerate(self.gene_map):
                sections_to_schedule.append(map_item["sections"][individual[i]])

        # --- Check for clashes (HARD constraint) ---
        for section in sections_to_schedule:
            if not timetable.can_add_section(section):
                return (0,)
            timetable.add_section(section)

        # --- DYNAMIC SCORING based on user's chosen style ---
        score = 10000.0
        style = self.user_preferences.get("schedule_style", "compact")

        # --- Define Scoring Profiles ---
        if style == "compact":
            days_score_map = {5: -1500, 4: -750, 3: 0, 2: 2000, 1: 3000}
            score += days_score_map.get(timetable.get_utilized_days(), -4000)
            GAP_SCORE_WEIGHT = 400
            STREAK_BONUS_2 = 150
            STREAK_PENALTY_1 = 150
            STREAK_PENALTY_3_PLUS = 650
        else:  # style == 'spaced_out'
            score -= timetable.get_utilized_days() * 250
            GAP_SCORE_WEIGHT = 1200
            STREAK_BONUS_2 = -200
            STREAK_PENALTY_1 = 50
            STREAK_PENALTY_3_PLUS = 800
            # ### NEW: Define the specific penalty for wasteful days ###
            PENALTY_FOR_SINGLE_CLASS_DAY = 450  # A significant penalty

        # --- Apply Universal and Gap Scores ---
        preferred_lecturers = self.user_preferences.get("preferred_lecturers", [])
        for sc in timetable.scheduled_classes:
            if sc.class_obj.lecturer in preferred_lecturers:
                score += 200
            if sc.day in self.user_preferences["preferred_days"]:
                score += 50
            if (
                self.user_preferences["preferred_start"]
                <= sc.start_time
                <= self.user_preferences["preferred_end"]
            ):
                score += 25

        total_gap_score = 0
        utilized_days = [day for day in DAYS if timetable.schedule[day]]
        if utilized_days:
            for day in utilized_days:
                total_gap_score += timetable.get_day_gaps_score(day)
            score += (total_gap_score / len(utilized_days)) * GAP_SCORE_WEIGHT

        # --- Apply Day Structure & Streak Scores (Now with the new penalty) ---
        for day in DAYS:
            day_classes = timetable.schedule[day]
            if not day_classes:
                continue

            # ### MODIFIED LOGIC HERE ###
            # Check for the single-class day case FIRST.
            if len(day_classes) == 1:
                if style == "spaced_out":
                    score -= PENALTY_FOR_SINGLE_CLASS_DAY
                else:  # 'compact' style
                    score -= STREAK_PENALTY_1  # A single class is just a failed streak
                continue  # Done with this day, move to the next

            # If we get here, the day has 2 or more classes, so we check streaks.
            consecutive_streak = 1
            for i in range(1, len(day_classes)):
                prev_end_dt = datetime.combine(
                    datetime.today(), day_classes[i - 1].end_time
                )
                curr_start_dt = datetime.combine(
                    datetime.today(), day_classes[i].start_time
                )

                if (curr_start_dt - prev_end_dt) <= timedelta(minutes=15):
                    consecutive_streak += 1
                else:
                    if consecutive_streak == 1:
                        score -= STREAK_PENALTY_1
                    elif consecutive_streak == 2:
                        score += STREAK_BONUS_2
                    else:
                        score -= (consecutive_streak - 2) * STREAK_PENALTY_3_PLUS
                    consecutive_streak = 1

            # Score the final streak of the day
            if consecutive_streak == 1:
                score -= STREAK_PENALTY_1
            elif consecutive_streak == 2:
                score += STREAK_BONUS_2
            else:
                score -= (consecutive_streak - 2) * STREAK_PENALTY_3_PLUS

        return (score,)

    # handles finding the best individual from the Hall of Fame and building
    # the final timetable. You will only need to adjust its decoding logic
    # when building the final timetable.

    def run(self, generations=150, pop_size=500) -> Optional[Timetable]:
        if not self.gene_map:
            print(
                "\nError: No sections available for the selected courses. Cannot generate a timetable."
            )
            return None

        pop = self.toolbox.population(n=pop_size)
        hof = tools.HallOfFame(1)
        stats = tools.Statistics(lambda ind: ind.fitness.values[0])
        stats.register("avg", np.mean)
        stats.register("max", np.max)
        stats.register("min", np.min)

        algorithms.eaSimple(
            pop,
            self.toolbox,
            cxpb=0.8,
            mutpb=0.2,
            ngen=generations,
            stats=stats,
            halloffame=hof,
            verbose=True,
        )

        if not hof or hof[0].fitness.values[0] == 0:
            print("\n" + "=" * 50)
            print("COULD NOT FIND A VALID, CLASH-FREE TIMETABLE")
            print(
                "This likely means there are unavoidable time clashes between the required sections of your chosen courses, even with all possible combinations."
            )
            print("Please try a different combination of courses.")
            print("=" * 50)
            return None

        # Build the best timetable from the best individual
        best_ind = hof[0]
        best_timetable = Timetable()

        # --- Decode the BEST individual to build the final timetable ---
        # This logic mirrors the decoding in evaluate()
        sections_to_schedule = []
        if self.enforce_ties:
            gene_idx = 0
            for map_item in self.gene_map:
                lecture_choice = best_ind[gene_idx]
                tutorial_choice = best_ind[gene_idx + 1]
                chosen_pair = map_item["pairs"][lecture_choice]
                lecture_section = chosen_pair[0]
                sections_to_schedule.append(lecture_section)
                tied_tutorials = chosen_pair[1]
                if tied_tutorials:
                    safe_tutorial_choice = tutorial_choice % len(tied_tutorials)
                    tutorial_section = tied_tutorials[safe_tutorial_choice]
                    sections_to_schedule.append(tutorial_section)
                gene_idx += 2
        else:  # Not enforcing ties
            for i, map_item in enumerate(self.gene_map):
                choice = best_ind[i]
                sections_to_schedule.append(map_item["sections"][choice])

        for section in sections_to_schedule:
            best_timetable.add_section(section)

        return best_timetable


# In tt.py, replace your existing get_user_preferences function with this one.


def get_user_preferences(classes: List[Class]) -> dict:
    """Get user preferences, including courses, days, times, ties, and lecturers."""
    # --- Get Course Selection (Existing logic) ---
    all_courses = sorted({cls.course for cls in classes})
    print("\nAvailable Courses:")
    for i, course in enumerate(all_courses, 1):
        print(f"{i}. {course}")

    while True:
        try:
            selections = (
                input("\nEnter preferred course numbers (comma separated): ")
                .strip()
                .split(",")
            )
            selected_courses = [
                all_courses[int(sel) - 1] for sel in selections if sel.strip()
            ]
            if not selected_courses:
                print("Please select at least one course.")
                continue
            break
        except (ValueError, IndexError):
            print("Invalid selection. Please enter numbers from the list.")

    # --- Get Day/Time Preferences (Existing logic) ---
    print("\nAvailable Days:", DAYS)
    while True:
        preferred_days_str = input(
            f"Enter preferred days (e.g., Monday,Tuesday) or press Enter for any: "
        ).strip()
        if not preferred_days_str:
            preferred_days = DAYS  # Default to all days
            break
        preferred_days = [
            day.strip().capitalize() for day in preferred_days_str.split(",")
        ]
        if any(day not in DAYS for day in preferred_days):
            print(f"Invalid day found. Please choose from {DAYS}")
        else:
            break

    # ... (Keep your existing time preference logic)
    print("\nPreferred time range (24-hour format)")
    while True:
        try:
            start = input("Earliest preferred start time (e.g., 09:00): ").strip()
            end = input("Latest preferred end time (e.g., 16:00): ").strip()
            preferred_start = datetime.strptime(start, "%H:%M").time()
            preferred_end = datetime.strptime(end, "%H:%M").time()
            if preferred_start >= preferred_end:
                print("End time must be after start time")
                continue
            break
        except ValueError:
            print("Invalid time format. Please use HH:MM (24-hour format)")

    # --- Get Tie Enforcement (Existing logic) ---
    while True:
        enforce_str = (
            input("\nEnforce lecture/tutorial ties? (Highly recommended) (yes/no): ")
            .strip()
            .lower()
        )
        if enforce_str in ["yes", "y", ""]:  # Default to yes
            enforce_ties = True
            break
        elif enforce_str in ["no", "n"]:
            enforce_ties = False
            break
        else:
            print("Invalid input. Please enter 'yes' or 'no'.")

    # ### NEW: Get Lecturer Preferences ###
    # First, find all lecturers available for the selected courses.
    available_lecturers = sorted(
        list(
            set(
                cls.lecturer
                for cls in classes
                if cls.course in selected_courses and cls.lecturer != "Not Assigned"
            )
        )
    )

    selected_lecturers = []
    if available_lecturers:
        print("\n--- Optional: Select Preferred Lecturers ---")
        print("Schedules with these lecturers will be prioritized.")
        for i, lec in enumerate(available_lecturers, 1):
            print(f"{i}. {lec}")

        while True:
            try:
                lec_selections_str = input(
                    "\nEnter numbers of preferred lecturers (comma separated), or press Enter to skip: "
                ).strip()
                if not lec_selections_str:
                    break  # User skipped
                lec_selections = lec_selections_str.split(",")
                selected_lecturers = [
                    available_lecturers[int(sel) - 1]
                    for sel in lec_selections
                    if sel.strip()
                ]
                break
            except (ValueError, IndexError):
                print("Invalid selection. Please enter numbers from the list.")

    # ### NEW: Get Scheduling Style Preference ###
    print("\n--- Select Your Scheduling Style ---")
    print(
        "1. Compact: Prioritizes fewer days on campus, even if it means more back-to-back classes."
    )
    print(
        "2. Spaced Out: Prioritizes having breaks between classes, even if it means more days on campus."
    )
    while True:
        style_choice = input("Choose your preferred style (1 or 2): ").strip()
        if style_choice == "1":
            schedule_style = "compact"
            break
        elif style_choice == "2":
            schedule_style = "spaced_out"
            break
        else:
            print("Invalid selection. Please enter 1 or 2.")

    # ### Add the new choice to the returned dictionary ###
    return {
        "courses": selected_courses,  # From your existing code
        "preferred_days": preferred_days,  # From your existing code
        "preferred_start": preferred_start,  # From your existing code
        "preferred_end": preferred_end,  # From your existing code
        "enforce_ties": enforce_ties,  # From your existing code
        "preferred_lecturers": selected_lecturers,  # From your existing code
        "schedule_style": schedule_style,  # ### NEW ###
    }


def print_timetable(timetable: Timetable):
    """Print the timetable in readable format"""
    print("\n=== Optimized Timetable ===")
    for day in DAYS:
        print(f"\n{day}:")
        if not timetable.schedule[day]:
            print("No classes")
            continue

        # Group by course and section for better display
        day_classes = defaultdict(list)
        for sc in timetable.schedule[day]:
            key = f"{sc.class_obj.course} - {sc.class_obj.activity} {sc.class_obj.section}"
            day_classes[key].append(sc)

        for section, classes in sorted(day_classes.items()):
            classes_sorted = sorted(classes, key=lambda x: x.start_time)
            print(f"\n{section}:")
            for sc in classes_sorted:
                print(
                    f"  {sc.start_time.strftime('%H:%M')}-{sc.end_time.strftime('%H:%M')} "
                    f"at {sc.class_obj.venue} with {sc.class_obj.lecturer}"
                )


def print_section_summary(timetable: Timetable):
    """Show which sections were selected"""
    print("\n=== Selected Sections ===")
    sections_by_course = defaultdict(lambda: defaultdict(list))
    for sc in timetable.scheduled_classes:
        sections_by_course[sc.class_obj.course][sc.class_obj.activity].append(
            sc.class_obj.section
        )

    for course, activities in sections_by_course.items():
        print(f"\n{course}:")
        for activity, sections in activities.items():
            unique_sections = sorted(set(sections))
            print(f"  {activity}: {', '.join(unique_sections)}")


def print_missing_courses(
    timetable: Timetable, selected_courses: List[str], section_groups: Dict
):
    """Print any courses that couldn't be scheduled"""
    scheduled_courses = {sc.class_obj.course for sc in timetable.scheduled_classes}
    missing = set(selected_courses) - scheduled_courses
    if missing:
        print("\n=== Warning: Could Not Schedule ===")
        for course in missing:
            print(f"  - {course}")
            # Show available sections for missing courses
            if course in section_groups:
                print("    Available sections:")
                for section_key in section_groups[course]:
                    print(f"    - {section_key}")


# In tt.py, add this new function somewhere before your main() function.


def print_lecturer_summary(timetable: Timetable, user_prefs: dict):
    """Shows which of the user's preferred lecturers were scheduled."""
    preferred_lecturers = user_prefs.get("preferred_lecturers", [])
    if not preferred_lecturers:
        return  # Don't print anything if the user didn't select any

    print("\n=== Lecturer Preference Summary ===")

    scheduled_lecturers = {sc.class_obj.lecturer for sc in timetable.scheduled_classes}

    honored_prefs = set(preferred_lecturers) & scheduled_lecturers

    if honored_prefs:
        print(
            f"Successfully scheduled classes with: {', '.join(sorted(list(honored_prefs)))}"
        )
    else:
        print(
            "Unfortunately, none of your preferred lecturers could be included in a clash-free schedule."
        )


def main():
    print("=== University Timetable Generator ===")
    classes = load_classes_from_csv("classes.csv")
    if not classes:
        print("Could not load any classes from classes.csv. Exiting.")
        return

    print(f"Loaded {len(classes)} classes from CSV")

    user_prefs = get_user_preferences(classes)

    print("\nGenerating timetable based on your preferences...")
    try:
        generator = TimetableGenerator(classes, user_prefs)
        best_timetable = generator.run(generations=150, pop_size=500)

        # ### CHANGED ###: Handle the case where no timetable is returned
        if best_timetable:
            print_timetable(best_timetable)
            print_section_summary(best_timetable)
            print_lecturer_summary(best_timetable, user_prefs)  # ### ADD THIS LINE ###

            print("\n=== Schedule Statistics ===")
            days_used = best_timetable.get_utilized_days()
            print(f"Days used: {days_used} of {len(DAYS)}")
            preferred_days_used = len(
                [
                    d
                    for d in user_prefs["preferred_days"]
                    if any(sc.day == d for sc in best_timetable.scheduled_classes)
                ]
            )
            print(
                f"Preferred days used: {preferred_days_used} of {len(user_prefs['preferred_days'])}"
            )

            # Calculate average gap between classes
            total_gap = timedelta()
            gap_count = 0
            for day in DAYS:
                day_classes = sorted(
                    best_timetable.schedule[day], key=lambda x: x.start_time
                )
                for i in range(1, len(day_classes)):
                    prev_end = datetime.combine(
                        datetime.today(), day_classes[i - 1].end_time
                    )
                    curr_start = datetime.combine(
                        datetime.today(), day_classes[i].start_time
                    )
                    gap = curr_start - prev_end
                    if gap > timedelta(0):  # Only count positive gaps
                        total_gap += gap
                        gap_count += 1
            avg_gap = total_gap / gap_count if gap_count > 0 else timedelta(0)
            print(f"Average gap between classes: {avg_gap}")

            # Check for consecutive classes
            consecutive_counts = []
            for day in DAYS:
                day_classes = sorted(
                    best_timetable.schedule[day], key=lambda x: x.start_time
                )
                current_streak = 1
                for i in range(1, len(day_classes)):
                    prev_end = datetime.combine(
                        datetime.today(), day_classes[i - 1].end_time
                    )
                    curr_start = datetime.combine(
                        datetime.today(), day_classes[i].start_time
                    )
                    if curr_start - prev_end <= timedelta(
                        minutes=15
                    ):  # Considered consecutive if gap <= 15 mins
                        current_streak += 1
                    else:
                        if current_streak > 1:
                            consecutive_counts.append(current_streak)
                        current_streak = 1
                if current_streak > 1:
                    consecutive_counts.append(current_streak)

            if consecutive_counts:
                print(f"Consecutive classes: {', '.join(map(str, consecutive_counts))}")
            else:
                print("No consecutive classes (more than 1 in a row)")

    except ValueError as e:
        print(f"\nAn error occurred: {e}")


if __name__ == "__main__":
    main()
