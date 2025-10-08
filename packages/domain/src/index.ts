/**
 * @module Domain
 * @description APP_NAME uygulamasında domain modelleri ve value object'lerin merkezi paketi.
 * Tip güvenli ve yeniden kullanılabilir domain nesneleri sağlar.
 *
 * @example
 * ```ts
 * import { Vehicle } from "@monorepo/domain";
 *
 * const myCar = new Vehicle({
 *   brand: "Toyota",
 *   model: "Corolla",
 *   year: 2023
 * });
 *
 * console.log(myCar.fullName); // "Toyota Corolla"
 * ```
 */

/** ---------- ÖRNEK VALUE OBJECT ---------- */
export class Vehicle {
  readonly brand: string;
  readonly model: string;
  readonly year: number;

  constructor({ brand, model, year }: { brand: string; model: string; year: number }) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  get fullName() {
    return `${this.brand} ${this.model}`;
  }
}

