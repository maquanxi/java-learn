package com.itdayangbaihuo;

public class VipCard extends ShoppingCard {
    public VipCard(String userName, double prestoreAmount, double balance) {
        super(userName, prestoreAmount, balance);
        if (prestoreAmount < 5000) {
            throw new IllegalArgumentException("VIP卡预存金额不能少于5000元。");
        }
    }

    @Override
    public double getDiscount() {
        return 0.98;
    }

    @Override
    public String getCardName() {
        return "VIP卡";
    }
}
