import { AppDataSource } from "../data-source";
import { Ring } from "../models/Ring";

export class RingService {
  private ringRepository = AppDataSource.getRepository(Ring);

  private normalizeText(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  private getMaxRingsForCreator(forjadoPor: string): number {
    const limits = { elfos: 3, anoes: 7, homens: 9, sauron: 1 };
    return limits[this.normalizeText(forjadoPor)] || 0;
  }

  async createRing(ringData: Partial<Ring>) {
    console.log('Recebido ringData:', ringData);

    if (!ringData.forjadoPor) {
      throw new Error("O campo 'forjadoPor' é obrigatório.");
    }

    const normalizedCreator = this.normalizeText(ringData.forjadoPor);
    console.log('Nome normalizado do forjador:', normalizedCreator);

    const maxRings = this.getMaxRingsForCreator(normalizedCreator);
    console.log('Limite de anéis:', maxRings);

    const currentCount = await this.ringRepository.count({
      where: { forjadoPor: normalizedCreator }
    });
    console.log('Número atual de anéis para o forjador:', currentCount);

    if (currentCount >= maxRings) {
      throw new Error(`Limite de anéis para ${ringData.forjadoPor} atingido.`);
    }

    const newRing = this.ringRepository.create(ringData);
    return await this.ringRepository.save(newRing);
  }

  async listRings() {
    return await this.ringRepository.find();
  }

  async updateRing(id: number, ringData: Partial<Ring>) {
    await this.ringRepository.update(id, ringData);
  }

  async deleteRing(id: number) {
    await this.ringRepository.delete(id);
  }

  async getRingById(id: number) {
    return await this.ringRepository.findOneBy({ id });
  }
}
