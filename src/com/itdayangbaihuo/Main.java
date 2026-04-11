package com.itdayangbaihuo;

public class Main {
    public static void main(String[] args) {
        GoldVipCard goldVipCard = new GoldVipCard("马全喜", 10000, 10000);
        GuestVipCard guestVipCard = new GuestVipCard("张文卓", 8000, 8000);
        VipCard vipCard = new VipCard("刘蠢燕", 5000, 5000);

        goldVipCard.consume(2000);
        guestVipCard.consume(1500);
        vipCard.consume(1000);
    }
}
