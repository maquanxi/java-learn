public class ComputerStudent extends Student implements MathCompute {
    public ComputerStudent(String name, int age) {
        super(name, age);
    }

    @Override
    public void studyCourse() {
        System.out.println(name + "学专业课。");
    }

    @Override
    public void mathCompute() {
        System.out.println(name + "艰难地进行数学计算。");
    }
}
