package com.itdayangbaihuo;

public abstract class Vip {
    private final double amount;

    public Vip(double amount) {
        this.amount = amount;
    }

    public abstract double getDiscount();

    public void consume() {
        double payAmount = amount * getDiscount();
        System.out.printf(
                "%s消费了%.1f元,%.1f折，扣款%.1f元%n",
                getClass().getSimpleName(),
                amount,
                getDiscount() * 10,
                payAmount
        );
    }
}
