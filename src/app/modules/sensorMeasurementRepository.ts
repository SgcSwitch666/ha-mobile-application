import {Measurement} from '../measurements/measurements.component';

export interface SensorMeasurementRepository {
    sensorid: number;
    sensorname: string;
    measurementList: Measurement[];
    latestMeasurement?: Measurement | null;
  }