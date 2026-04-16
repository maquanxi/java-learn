package com.itdayangbaihuo;

public class GoldVip extends Vip {
    public GoldVip(double amount) {
        super(amount);
    }

    @Override
    public double getDiscount() {
        return 0.9;
    }
}
