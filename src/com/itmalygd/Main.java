package com.itmalygd;

public class Main {
    public static void main(String[] args) {
        ComputerTeacher computerTeacher = new ComputerTeacher("王安石", 45);
        ComputerStudent computerStudent = new ComputerStudent("李白", 20);
        EnglishTeacher englishTeacher = new EnglishTeacher("苏轼", 40);
        EnglishStudent englishStudent = new EnglishStudent("李阳", 19);

        computerTeacher.teachCourse();
        computerTeacher.mathCompute();

        computerStudent.mathCompute();

        englishTeacher.teachCourse();

        englishStudent.studyCourse();
    }
}
