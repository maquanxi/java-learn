package com.itwagemanage;
public class Employee extends Person {
    private String id;
    private double wage;
    private int age;
    public Employee(String name, String address, String id, double wage, int age) {
        super(name, address);
        this.id = id;
        this.wage = wage;
        this.age = age;
    }

    public double add(String position) {
        return wage;
    }
    public String getPosition() {
        return "员工";
    }
    public String getInfo() {
        return getPosition() + "：" + getName() + "，编号：" + id + "，年龄：" + age + "，地址：" + getAddress();
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public double getWage() {
        return wage;
    }
    public void setWage(double wage) {
        this.wage = wage;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
}
