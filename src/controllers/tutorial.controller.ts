import { Request, Response } from "express";
import tutorialRepository from "../repositories/tutorial.repository";
import usuarios from "../models/tutorial.model";

export default class TutorialController {
	async create(req: Request, res: Response) {
		if (!req.body.name) {
			res.status(400).send({
				message: "Content can not be empty!",
			});
			return;
		}

		try {
			const tutorial: usuarios = req.body;
			const savedTutorial = await tutorialRepository.save(tutorial);

			res.status(201).send(savedTutorial);
		} catch (err) {
			res.status(500).send({
				message: "Some error occurred while saving the tutorial.",
			});
		}
	}

	async findAll(req: Request, res: Response) {
		const name = typeof req.query.name === "string" ? req.query.name : "";

		try {
			const tutorials = await tutorialRepository.retrieveAll({ name: name });

			res.status(200).send(tutorials);
		} catch (err) {
			res.status(500).send({
				message: "Some error occurred while retrieving tutorials.",
			});
		}
	}

	async findOne(req: Request, res: Response) {
		const id: number = parseInt(req.params.id);

		try {
			const tutorial = await tutorialRepository.retrieveById(id);

			if (tutorial) res.status(200).send(tutorial);
			else
				res.status(404).send({
					message: `Cannot find Tutorial with id=${id}.`,
				});
		} catch (err) {
			res.status(500).send({
				message: `Error retrieving Tutorial with id=${id}.`,
			});
		}
	}

	async findCombinedInfo(req: Request, res: Response) {
		try {
			const combinedInfo = await tutorialRepository.retrieveCombinedInfo();
			res.status(200).send(combinedInfo);
		} catch (err) {
			res.status(500).send({
				message: "Some error occurred while retrieving combined information.",
			});
		}
	}

	async findCombinedInfoById(req: Request, res: Response) {
		const id: number = parseInt(req.params.id);

		try {
			const combinedInfo = await tutorialRepository.retrieveCombinedInfoById(
				id
			);
			if (combinedInfo.length) {
				res.status(200).send(combinedInfo[0]);
			} else {
				res.status(404).send({
					message: `Cannot find information with id=${id}.`,
				});
			}
		} catch (err) {
			res.status(500).send({
				message: `Error retrieving information with id=${id}.`,
			});
		}
	}

	async update(req: Request, res: Response) {
		let tutorial: usuarios = req.body;
		tutorial.id = parseInt(req.params.id);

		try {
			const num = await tutorialRepository.update(tutorial);

			if (num == 1) {
				res.status(200).send({
					message: "Tutorial was updated successfully.",
				});
			} else {
				res.status(404).send({
					message: `Cannot update Tutorial with id=${tutorial.id}. Maybe Tutorial was not found or req.body is empty!`,
				});
			}
		} catch (err) {
			res.status(500).send({
				message: `Error updating Tutorial with id=${tutorial.id}.`,
			});
		}
	}

	async delete(req: Request, res: Response) {
		const id: number = parseInt(req.params.id);

		try {
			const num = await tutorialRepository.delete(id);

			if (num == 1) {
				res.status(200).send({
					message: "User was deleted successfully!",
				});
			} else {
				res.status(404).send({
					message: `Cannot delete user with id=${id}. Maybe user was not found!`,
				});
			}
		} catch (err) {
			res.status(500).send({
				message: `Could not delete user with id=${id}.`,
			});
		}
	}

	async deleteAll(req: Request, res: Response) {
		try {
			const num = await tutorialRepository.deleteAll();

			res
				.status(200)
				.send({ message: `${num} Tutorials were deleted successfully!` });
		} catch (err) {
			res.status(500).send({
				message: "Some error occurred while removing all tutorials.",
			});
		}
	}
}
