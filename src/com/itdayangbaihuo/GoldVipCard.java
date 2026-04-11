package com.itdayangbaihuo;

public class GoldVipCard extends ShoppingCard {
    public GoldVipCard(String userName, double prestoreAmount, double balance) {
        super(userName, prestoreAmount, balance);
        if (prestoreAmount < 10000) {
            throw new IllegalArgumentException("黄金VIP卡预存金额不能少于10000元。");
        }
    }

    @Override
    public double getDiscount() {
        return 0.9;
    }

    @Override
    public String getCardName() {
        return "黄金VIP卡";
    }
}
