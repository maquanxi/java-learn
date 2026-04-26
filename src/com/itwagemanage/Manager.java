package com.itwagemanage;
public class Manager extends Employee {
    private String level;
    public Manager(String name, String address, String id, double wage, int age, String level) {
        super(name, address, id, wage, age);
        this.level = level;
    }
    @Override
    public double add(String position) {
        if ("经理".equals(position)) {
            setWage(getWage() * 1.2);
        }
        return getWage();
    }

    @Override
    public String getPosition() {
        return "经理";
    }
    @Override
    public String getInfo() {
        return super.getInfo() + "，级别：" + level;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
