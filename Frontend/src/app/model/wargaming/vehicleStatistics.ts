import { Vehicle } from './vehicle';

export interface VehicleStatistics {
  spotted: number;
  battles_on_stunning_vehicles: number;
  track_assisted_damage: number;
  avg_damage_blocked: number;
  direct_hits_received: number;
  explosion_hits: number;
  piercings_received: number;
  piercings: number;
  xp: number;
  survived_battles: number;
  dropped_capture_points: number;
  hits_percents: number;
  draws: number;
  battles: number;
  damage_received: number;
  avg_damage_assisted: number;
  avg_damage_assisted_track: number;
  frags: number;
  stun_number: number;
  avg_damage_assisted_radio: number;
  capture_points: number;
  explosion_hits_received: number;
  stun_assisted_damage: number;
  hits: number;
  battle_avg_xp: number;
  wins: number;
  losses: number;
  damage_dealt: number;
  no_damage_direct_hits_received: number;
  shots: number;
  radio_assisted_damage: number;
  avg_damage_assisted_stun: number;
  tanking_factor: number;
}

export interface VehicleData {
  tank_id: number;
  in_garage: boolean;
  mark_of_mastery: number;
  account_id: number;
  max_xp: number;
  max_frags: number;
  frags: object; // Object.keys(playerInfo.statistics.frags) <- Tanks Ids; playerInfo.statistics.frags[key] <- Count
  globalmap: VehicleStatistics;
  team: VehicleStatistics;
  stronghold_defense: VehicleStatistics;
  all: VehicleStatistics;
  company: VehicleStatistics;
  regular_team: VehicleStatistics;
  stronghold_skirmish: VehicleStatistics;
  clan: VehicleStatistics;
  vehicleInfo?: Vehicle;
}
