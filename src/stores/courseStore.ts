import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultCourses, type Course, type Module, type Lesson } from '../data/academyCourses';

interface CourseState {
    courses: Course[];
    addCourse: (course: Course) => void;
    updateCourse: (id: number, updates: Partial<Course>) => void;
    deleteCourse: (id: number) => void;
    addModule: (courseId: number, module: Module) => void;
    updateModule: (courseId: number, moduleId: string, updates: Partial<Module>) => void;
    deleteModule: (courseId: number, moduleId: string) => void;
    addLesson: (courseId: number, moduleId: string, lesson: Lesson) => void;
    updateLesson: (courseId: number, moduleId: string, lessonId: string, updates: Partial<Lesson>) => void;
    deleteLesson: (courseId: number, moduleId: string, lessonId: string) => void;
}

export const useCourseStore = create<CourseState>()(
    persist(
        (set) => ({
            courses: defaultCourses,

            addCourse: (course) => set((state) => ({
                courses: [...state.courses, course]
            })),

            updateCourse: (id, updates) => set((state) => ({
                courses: state.courses.map((c) => c.id === id ? { ...c, ...updates } : c)
            })),

            deleteCourse: (id) => set((state) => ({
                courses: state.courses.filter((c) => c.id !== id)
            })),

            addModule: (courseId, module) => set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === courseId
                        ? { ...c, modules: [...c.modules, module] }
                        : c
                )
            })),

            updateModule: (courseId, moduleId, updates) => set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === courseId
                        ? {
                            ...c,
                            modules: c.modules.map((m) => m.id === moduleId ? { ...m, ...updates } : m)
                        }
                        : c
                )
            })),

            deleteModule: (courseId, moduleId) => set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === courseId
                        ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) }
                        : c
                )
            })),

            addLesson: (courseId, moduleId, lesson) => set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === courseId
                        ? {
                            ...c,
                            modules: c.modules.map((m) =>
                                m.id === moduleId
                                    ? { ...m, lessons: [...m.lessons, lesson] }
                                    : m
                            )
                        }
                        : c
                )
            })),

            updateLesson: (courseId, moduleId, lessonId, updates) => set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === courseId
                        ? {
                            ...c,
                            modules: c.modules.map((m) =>
                                m.id === moduleId
                                    ? {
                                        ...m,
                                        lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, ...updates } : l)
                                    }
                                    : m
                            )
                        }
                        : c
                )
            })),

            deleteLesson: (courseId, moduleId, lessonId) => set((state) => ({
                courses: state.courses.map((c) =>
                    c.id === courseId
                        ? {
                            ...c,
                            modules: c.modules.map((m) =>
                                m.id === moduleId
                                    ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
                                    : m
                            )
                        }
                        : c
                )
            })),
        }),
        {
            name: 'oriento-courses-storage',
        }
    )
);
