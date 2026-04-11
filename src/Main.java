public class Main {
    public static void main(String[] args) {
        ComputerTeacher computerTeacher = new ComputerTeacher("马全喜", 45);
        ComputerStudent computerStudent = new ComputerStudent("张文卓", 20);
        EnglishTeacher englishTeacher = new EnglishTeacher("范宇轩", 40);
        EnglishStudent englishStudent = new EnglishStudent("胡文杰", 19);

        computerTeacher.teachCourse();
        computerTeacher.mathCompute();

        computerStudent.mathCompute();

        englishTeacher.teachCourse();

        englishStudent.studyCourse();
    }
}
