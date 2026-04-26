package com.itwagemanage;

public class Test {
    public static void main(String[] args) {
        Employee manager = new Manager("张强", "北京", "M001", 12000, 35, "高级经理");
        Employee worker = new Worker("李明", "上海", "W001", 6500, 26, "技术部");

        wage(manager);
        wage(worker);
    }
    public static void wage(Employee e) {
        String position = e.getPosition();
        double oldWage = e.getWage();
        double newWage = e.add(position);

        System.out.printf("%s%n%s 原工资：%.2f 元，涨工资后：%.2f 元%n%n",
                e.getInfo(), position, oldWage, newWage);
    }
}
