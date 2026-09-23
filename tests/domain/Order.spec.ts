import { describe, it, expect } from 'vitest';
import { Order } from '../../src/domain/entities/Order.js';
import { OrderId } from '../../src/domain/value-object/OrderId.js';
import { OrderItem } from '../../src/domain/value-object/OrderItem.js';
import { SKU } from '../../src/domain/value-object/SKU.js';
import { Quantity } from '../../src/domain/value-object/Quantity.js';
import { Money } from '../../src/domain/value-object/Money.js';
import { Currency } from '../../src/domain/value-object/Currency.js';

describe('Order Aggregate', () => {
    it('creates an order successfully with PENDING status and records OrderCreated event', () => {
        const orderIdResult = OrderId.create('ORDER-123');
        expect(orderIdResult.isSuccess).toBe(true);
        if (!orderIdResult.isSuccess) return;

        const orderResult = Order.create(orderIdResult.value, 'CUST-456');
        expect(orderResult.isSuccess).toBe(true);
        if (!orderResult.isSuccess) return;

        const order = orderResult.value;
        expect(order.id.value).toBe('ORDER-123');
        expect(order.customerId).toBe('CUST-456');
        expect(order.status).toBe('PENDING');
        expect(order.items.length).toBe(0);
        expect(order.domainEvents.length).toBe(1);
        expect(order.domainEvents[0].eventName).toBe('OrderCreated');
    });

    it('fails to create an order if customerId is empty', () => {
        const orderIdResult = OrderId.create('ORDER-123');
        if (!orderIdResult.isSuccess) return;

        const orderResult = Order.create(orderIdResult.value, '   ');
        expect(orderResult.isSuccess).toBe(false);
        if (orderResult.isFailure) {
            expect(orderResult.error.message).toContain('Customer ID cannot be empty');
        }
    });

    it('adds an item to order and records ItemAddedToOrder event', () => {
        const orderId = OrderId.create('ORDER-100');
        if (!orderId.isSuccess) return;
        const orderResult = Order.create(orderId.value, 'CUST-001');
        if (!orderResult.isSuccess) return;
        const order = orderResult.value;

        const sku = SKU.create('LAPTOP');
        const quantity = Quantity.create(2);
        const currency = Currency.create('USD');
        if (!sku.isSuccess || !quantity.isSuccess || !currency.isSuccess) return;

        const price = Money.create(999.99, currency.value);
        if (!price.isSuccess) return;

        const orderItem = OrderItem.create(sku.value, quantity.value, price.value);
        if (!orderItem.isSuccess) return;

        const addResult = order.addItem(orderItem.value);
        expect(addResult.isSuccess).toBe(true);
        expect(order.items.length).toBe(1);
        expect(order.items[0].sku.value).toBe('LAPTOP');
        expect(order.items[0].quantity.value).toBe(2);

        const events = order.domainEvents;
        expect(events.length).toBe(2);
        expect(events[1].eventName).toBe('ItemAddedToOrder');

        const totals = order.getTotalsPerCoin();
        expect(totals.get('USD')).toBeCloseTo(1999.98);
    });

    it('clears domain events properly', () => {
        const orderId = OrderId.create('ORDER-100');
        if (!orderId.isSuccess) return;
        const orderResult = Order.create(orderId.value, 'CUST-001');
        if (!orderResult.isSuccess) return;
        const order = orderResult.value;

        expect(order.domainEvents.length).toBe(1);
        order.clearEvents();
        expect(order.domainEvents.length).toBe(0);
    });
});
