import { Router } from "express";
import TutorialController from "../controllers/tutorial.controller";

class TutorialRoutes {
	router = Router();
	controller = new TutorialController();

	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {
		// Create a new Tutorial
		this.router.post("/", this.controller.create);

		// Retrieve all Tutorials
		this.router.get("/", this.controller.findAll);

		// Retrieve a single Tutorial with id
		this.router.get("/:id", this.controller.findOne);

		// Retrieve combined information from usuarios and permisos
		this.router.get("/combinedall/:id", this.controller.findCombinedInfo);

		// Retrieve combined information by id
		this.router.get("/combined/:id", this.controller.findCombinedInfoById);

		// Update a Tutorial with id
		this.router.put("/:id", this.controller.update);

		// Delete a Tutorial with id
		this.router.delete("/:id", this.controller.delete);

		// Delete all Tutorials
		this.router.delete("/", this.controller.deleteAll);
	}
}

export default new TutorialRoutes().router;
