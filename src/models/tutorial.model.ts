import { RowDataPacket } from "mysql2";

export default interface usuarios extends RowDataPacket {
	id?: number;
	typeID?: number;
	photo?: string;
	phone?: string;
	email?: string;
	name?: string;
}

export default interface permisos extends RowDataPacket {
	id?: number;
	permisoID: string;
}
