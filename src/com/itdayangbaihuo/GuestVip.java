package com.itdayangbaihuo;

public class GuestVip extends Vip {
    public GuestVip(double amount) {
        super(amount);
    }

    @Override
    public double getDiscount() {
        return 0.95;
    }
}
