package com.itmalygd;

public class EnglishTeacher extends Teacher {
    public EnglishTeacher(String name, int age) {
        super(name, age);
    }

    @Override
    public void teachCourse() {
        System.out.println(name + "激情昂扬地教专业课。");
    }
}
