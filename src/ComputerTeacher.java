public class ComputerTeacher extends Teacher implements MathCompute {
    public ComputerTeacher(String name, int age) {
        super(name, age);
    }

    @Override
    public void teachCourse() {
        System.out.println(name + "尽责地教专业课");
    }

    @Override
    public void mathCompute() {
        System.out.println("熟练地进行数学计算");
    }
}
