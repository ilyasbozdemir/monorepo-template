/**
 * @module Geo
 * 
 * Harita ve coğrafi verilerle ilgili işlemleri sağlar.
 * İleride harita tabanlı ek özellikler ve ilanlar için adaptör görevi sunar.
 */

/**
 * Coğrafi koordinatları temsil eder.
 */
export interface Coordinates {
  /** Enlem değeri */
  latitude: number;
  /** Boylam değeri */
  longitude: number;
}

/**
 * İlçeyi temsil eder.
 */
export interface District {
  /** İlçe ID'si */
  id: string;
  /** İlçe adı */
  name: string;
  /** Bu ilçenin ait olduğu şehir kodu */
  cityCode: string;
  /** Enlem */
  latitude: number;
  /** Boylam */
  longitude: number;
}

/**
 * Şehri ve içindeki ilçeleri temsil eder.
 */
export interface City {
  /** Şehir kodu */
  code: string;
  /** Şehir adı */
  name: string;
  /** Şehirdeki ilçeler */
  districts: District[];
}

/**
 * GeoManager, şehir ve ilçe verilerini yönetir.
 * Statik veri veya runtime ekleme ile şehir ve ilçeleri tutar.
 */
export class GeoManager {
  private cities: City[] = [];

  /**
   * GeoManager oluşturucu.
   * @param initialCities Başlangıç şehir verisi (opsiyonel)
   */
  constructor(initialCities?: City[]) {
    if (initialCities) this.cities = initialCities;
  }

  /**
   * Tüm şehirleri getirir.
   * @returns Şehir listesi
   */
  getCities(): City[] {
    return this.cities;
  }

  /**
   * Belirli bir şehrin ilçelerini getirir.
   * @param cityCode İlçeleri getirilecek şehir kodu
   * @returns İlçe listesi, şehir bulunamazsa boş dizi
   */
  getDistrictsByCity(cityCode: string): District[] {
    const city = this.cities.find(c => c.code === cityCode);
    return city?.districts ?? [];
  }

  /**
   * Yeni bir şehir ekler.
   * @param city Eklenecek şehir objesi
   */
  addCity(city: City) {
    this.cities.push(city);
  }

  /**
   * Belirli bir şehre yeni bir ilçe ekler.
   * @param cityCode İlçenin ekleneceği şehir kodu
   * @param district Eklenecek ilçe objesi
   */
  addDistrict(cityCode: string, district: District) {
    const city = this.cities.find(c => c.code === cityCode);
    if (city) city.districts.push(district);
  }
}
