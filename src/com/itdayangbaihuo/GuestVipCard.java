package com.itdayangbaihuo;

public class GuestVipCard extends ShoppingCard {
    public GuestVipCard(String userName, double prestoreAmount, double balance) {
        super(userName, prestoreAmount, balance);
        if (prestoreAmount < 8000) {
            throw new IllegalArgumentException("贵宾VIP卡预存金额不能少于8000元。");
        }
    }

    @Override
    public double getDiscount() {
        return 0.95;
    }

    @Override
    public String getCardName() {
        return "贵宾VIP卡";
    }
}
