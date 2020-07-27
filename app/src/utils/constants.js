export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const SUPPLIER_ADDED = "SupplierAdded"
export const SUPPLIER_REMOVED = "SupplierRemoved"
export const DELIVERY_MAN_ADDED = "DeliveryManAdded"
export const DELIVERY_MAN_REMOVED = "DeliveryManRemoved"
export const PRODUCT_SHIPPED = "ProductShipped"
export const PRODUCT_RECEIVED = "ProductReceived"
export const NEW_ITEM = "NewProduct"

export const EVENT_NAMES = [
	SUPPLIER_ADDED,
	SUPPLIER_REMOVED,
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
	// "OwnershipTransferred",
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED,
	NEW_ITEM
]

export const DELIVERY_MAN_EVENT_NAMES = [
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED
]

export const SUPPLIER_EVENT_NAMES = [
	SUPPLIER_ADDED,
	SUPPLIER_REMOVED,
	NEW_ITEM,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED
]

export const PRODUCT_EVENT_NAMES = [
	NEW_ITEM,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED
]

export const mapEventToString = {
	"SupplierAdded": "Supplier role granted",
	"SupplierRemoved": "Supplier role revoked",
	"DeliveryManAdded": "Delivery Man role granted",
	"DeliveryManRemoved": "Delivery Man role revoked",
	"ProductShipped": "Product shipped",
	"ProductReceived": "Product received",
	"SentToPurchaser": "Product sent to purchaser",
	"NewProduct": "New product"
}
