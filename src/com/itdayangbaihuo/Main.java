package com.itdayangbaihuo;

public class Main {
    public static void main(String[] args) {
        consume(new GuestVip(4000));
        consume(new GoldVip(6000));
    }

    public static void consume(Vip vip) {
        vip.consume();
    }
}