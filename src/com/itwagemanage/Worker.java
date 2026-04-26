package com.itwagemanage;
public class Worker extends Employee {
    private String department;
    public Worker(String name, String address, String id, double wage, int age, String department) {
        super(name, address, id, wage, age);
        this.department = department;
    }
    @Override
    public double add(String position) {
        if ("普通员工".equals(position)) {
            setWage(getWage() * 1.1);
        }
        return getWage();
    }
    @Override
    public String getPosition() {
        return "普通员工";
    }

    @Override
    public String getInfo() {
        return super.getInfo() + "，部门：" + department;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
