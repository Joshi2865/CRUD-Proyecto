import { ResultSetHeader } from "mysql2";
import connection from "../db";
import usuarios from "../models/tutorial.model";

interface ITutorialRepository {
	save(tutorial: usuarios): Promise<usuarios>;
	retrieveAll(searchParams: {
		typeID: number;
		photo: string;
		phone: string;
		email: string;
		name: string;
	}): Promise<usuarios[]>;
	retrieveById(tutorialId: number): Promise<usuarios | undefined>;
	update(tutorial: usuarios): Promise<number>;
	delete(tutorialId: number): Promise<number>;
	deleteAll(): Promise<number>;
	retrieveCombinedInfo(): Promise<any[]>;
}

class TutorialRepository implements ITutorialRepository {
	save(tutorial: usuarios): Promise<usuarios> {
		return new Promise((resolve, reject) => {
			connection.query<ResultSetHeader>(
				"INSERT INTO usuarios (typeID ,photo, phone, email, name) VALUES(?,?,?,?,?)",
				[
					tutorial.typeID,
					tutorial.photo,
					tutorial.phone,
					tutorial.email,
					tutorial.name,
				],
				(err, res) => {
					if (err) reject(err);
					else
						this.retrieveById(res.insertId)
							.then((tutorial) => resolve(tutorial!))
							.catch(reject);
				}
			);
		});
	}

	retrieveAll(searchParams: {
		photo?: string;
		phone?: string;
		email?: string;
		name?: string;
	}): Promise<usuarios[]> {
		let query: string = "SELECT * FROM usuarios";
		let condition: string = "";

		if (searchParams?.email)
			condition += `LOWER(title) LIKE '%${searchParams.email}%'`;

		if (condition.length) query += " WHERE " + condition;

		return new Promise((resolve, reject) => {
			connection.query<usuarios[]>(query, (err, res) => {
				if (err) reject(err);
				else resolve(res);
			});
		});
	}

	retrieveById(tutorialId: number): Promise<usuarios> {
		return new Promise((resolve, reject) => {
			connection.query<usuarios[]>(
				"SELECT * FROM usuarios WHERE id = ?",
				[tutorialId],
				(err, res) => {
					if (err) reject(err);
					else resolve(res?.[0]);
				}
			);
		});
	}

	retrieveCombinedInfo(): Promise<any[]> {
		const query = `
			SELECT usuarios.photo, usuarios.phone, usuarios.email, usuarios.name, permisos.roll AS permisoID
			FROM usuarios
			JOIN permisos ON usuarios.typeID = permisos.id
		`;

		return new Promise((resolve, reject) => {
			connection.query<any[]>(query, (err, res) => {
				if (err) reject(err);
				else resolve(res);
			});
		});
	}

	retrieveCombinedInfoById(tutorialId: number): Promise<any[]> {
		const query = `
			SELECT usuarios.photo, usuarios.phone, usuarios.email, usuarios.name, permisos.roll AS permisoID
			FROM usuarios
			JOIN permisos ON usuarios.typeID = permisos.id
			WHERE usuarios.id = ?
		`;

		return new Promise((resolve, reject) => {
			connection.query<any[]>(query, [tutorialId], (err, res) => {
				if (err) reject(err);
				else resolve(res);
			});
		});
	}

	update(tutorial: usuarios): Promise<number> {
		return new Promise((resolve, reject) => {
			connection.query<ResultSetHeader>(
				"UPDATE usuarios SET typeID = ?, photo = ?, phone = ?, email = ?, name = ? WHERE id = ?",
				[
					tutorial.typeID,
					tutorial.photo,
					tutorial.phone,
					tutorial.email,
					tutorial.name,
					tutorial.id,
				],
				(err, res) => {
					if (err) reject(err);
					else resolve(res.affectedRows);
				}
			);
		});
	}

	delete(tutorialId: number): Promise<number> {
		return new Promise((resolve, reject) => {
			connection.query<ResultSetHeader>(
				"DELETE FROM usuarios WHERE id = ?",
				[tutorialId],
				(err, res) => {
					if (err) reject(err);
					else resolve(res.affectedRows);
				}
			);
		});
	}

	deleteAll(): Promise<number> {
		return new Promise((resolve, reject) => {
			connection.query<ResultSetHeader>("DELETE FROM usuarios", (err, res) => {
				if (err) reject(err);
				else resolve(res.affectedRows);
			});
		});
	}
}

export default new TutorialRepository();
