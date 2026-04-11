public class EnglishStudent extends Student {
    public EnglishStudent(String name, int age) {
        super(name, age);
    }

    @Override
    public void studyCourse() {
        System.out.println(name + "努力地学专业课。");
    }
}
