export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const MAKER_ADDED = "MakerAdded"
export const MAKER_REMOVED = "MakerRemoved"
export const DELIVERY_MAN_ADDED = "DeliveryManAdded"
export const DELIVERY_MAN_REMOVED = "DeliveryManRemoved"
export const PRODUCT_SHIPPED = "ProductShipped"
export const PRODUCT_RECEIVED = "ProductReceived"
export const SEND_TO_PURCHASER = "SentToPurchaser"
export const NEW_ITEM = "NewItem"

export const EVENT_NAMES = [
	MAKER_ADDED,
	MAKER_REMOVED,
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
	// "OwnershipTransferred",
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED,
	SEND_TO_PURCHASER,
	NEW_ITEM
]

export const DELIVERY_MAN_EVENT_NAMES = [
	DELIVERY_MAN_ADDED,
	DELIVERY_MAN_REMOVED,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED,
	SEND_TO_PURCHASER
]

export const MAKER_EVENT_NAMES = [
	MAKER_ADDED,
	MAKER_REMOVED,
	NEW_ITEM,
	PRODUCT_SHIPPED,
	PRODUCT_RECEIVED,
	SEND_TO_PURCHASER
]

export const PRODUCT_EVENT_NAMES = [PRODUCT_SHIPPED, PRODUCT_RECEIVED]

export const mapEventToString = {
	"MakerAdded": "Maker role granted",
	"MakerRemoved": "Maker role revoked",
	"DeliveryManAdded": "Delivery Man role granted",
	"DeliveryManRemoved": "Delivery Man role revoked",
	"ProductShipped": "Product shipped",
	"ProductReceived": "Product received",
	"SentToPurchaser": "Product sent to purchaser",
	"NewItem": "New product"
}
