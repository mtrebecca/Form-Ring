import { Request, Response } from "express";
import { RingService } from "../services/RingService";

export class RingController {
  private ringService = new RingService();

  create = async (req: Request, res: Response) => {
    try {
      const ring = await this.ringService.createRing(req.body);
      res.status(201).json(ring);
    } catch (error: any) {
      console.error('Erro ao criar anel:', error);
      res.status(400).json({ message: error.message });
    }
  };

  list = async (_: Request, res: Response) => {
    try {
      const rings = await this.ringService.listRings();
      res.json(rings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rings" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      await this.ringService.updateRing(+req.params.id, req.body);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Error updating ring" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.ringService.deleteRing(+req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Error deleting ring" });
    }
  };

  getRingById = async (req: Request, res: Response) => {
    try {
      const ring = await this.ringService.getRingById(+req.params.id);
      if (!ring) {
        return res.status(404).json({ message: "Anel não encontrado" });
      }
      res.json(ring);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar anel" });
    }
  };

  public async getForjadoresCount(req: Request, res: Response): Promise<void> {
    const { forjadoPor } = req.query;

    if (typeof forjadoPor !== "string") {
      res.status(400).json({ error: "Tipo de forjador inválido." });
      return;
    }

    try {
      const rings = await this.ringService.listRings();
      const count = rings.filter(
        (ring) => ring.forjadoPor === forjadoPor
      ).length;
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter a contagem de forjadores." });
    }
  }
}
