package com.itdayangbaihuo;

public abstract class ShoppingCard implements Discountable {
    protected String userName;
    protected double prestoreAmount;
    protected double balance;

    public ShoppingCard(String userName, double prestoreAmount, double balance) {
        this.userName = userName;
        this.prestoreAmount = prestoreAmount;
        this.balance = balance;
    }
    public abstract String getCardName();
    public void consume(double amount) {
        double actualAmount = amount * getDiscount();
        if (actualAmount > balance) {
            System.out.println(getCardName() + "用户" + userName + "余额不足，无法完成消费。");
            return;
        }
        balance -= actualAmount;
        System.out.println("卡类型：" + getCardName()
                + "，用户名：" + userName
                + "，商品金额：" + amount
                + "，折后消费：" + actualAmount
                + "，余额：" + balance);
    }
}
