package events

import (
	"log"
	"sync"
)

type EventType string

const (
	EventTransactionApproved EventType = "transaction.approved"
	EventHrEmployeeCreated   EventType = "hr.employee_created"
	EventDealStatusChanged   EventType = "deal.status_changed"
)

type Event struct {
	Type EventType
	Data interface{}
}

type EventHandler func(Event)

type EventBus struct {
	handlers map[EventType][]EventHandler
	mu       sync.RWMutex
}

var (
	instance *EventBus
	once     sync.Once
)

func GetEventBus() *EventBus {
	once.Do(func() {
		instance = &EventBus{
			handlers: make(map[EventType][]EventHandler),
		}
	})
	return instance
}

func (eb *EventBus) Subscribe(eventType EventType, handler EventHandler) {
	eb.mu.Lock()
	defer eb.mu.Unlock()
	eb.handlers[eventType] = append(eb.handlers[eventType], handler)
	log.Printf("[EventBus] Subscribed to %s\n", eventType)
}

func (eb *EventBus) Publish(eventType EventType, data interface{}) {
	eb.mu.RLock()
	defer eb.mu.RUnlock()

	if handlers, ok := eb.handlers[eventType]; ok {
		for _, handler := range handlers {
			// Execute handler asynchronously so publisher doesn't block
			go func(h EventHandler, eventData interface{}) {
				defer func() {
					if r := recover(); r != nil {
						log.Printf("[EventBus] Panic in handler for %s: %v\n", eventType, r)
					}
				}()
				h(Event{Type: eventType, Data: eventData})
			}(handler, data)
		}
	}
}
