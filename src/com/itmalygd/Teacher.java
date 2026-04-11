package com.itmalygd;

public abstract class Teacher extends Person {
    public Teacher(String name, int age) {
        super(name, age);
    }

    public abstract void teachCourse();
}
