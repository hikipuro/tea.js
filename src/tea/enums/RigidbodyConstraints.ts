export enum RigidbodyConstraints {
	None = 0,
	FreezePositionX = 0x02,
	FreezePositionY = 0x04,
	FreezePositionZ = 0x08,
	FreezePosition = 0x0E,
	FreezeRotationX = 0x10,
	FreezeRotationY = 0x20,
	FreezeRotationZ = 0x40,
	FreezeRotation = 0x70,
	FreezeAll = 0x7E
}
