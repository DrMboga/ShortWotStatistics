export interface WotPlayerPrivateData {
  gold: number;
  free_xp: number;
  credits: number;
  premium_expires_at: number;
  bonds: number;
  battle_life_time: number;
}

export interface WotPlayerStatistics {
  spotted: number;
  battles_on_stunning_vehicles: number;
  track_assisted_damage: number;
  max_xp: number;
  avg_damage_blocked: number;
  direct_hits_received: number;
  explosion_hits: number;
  piercings_received: number;
  piercings: number;
  max_damage_tank_id: number;
  xp: number;
  survived_battles: number;
  dropped_capture_points: number;
  hits_percents: number;
  draws: number;
  max_xp_tank_id: number;
  battles: number;
  damage_received: number;
  avg_damage_assisted: number;
  max_frags_tank_id: number;
  avg_damage_assisted_track: number;
  frags: number;
  stun_number: number;
  avg_damage_assisted_radio: number;
  capture_points: number;
  explosion_hits_received: number;
  stun_assisted_damage: number;
  max_damage: number;
  hits: number;
  battle_avg_xp: number;
  wins: number;
  losses: number;
  damage_dealt: number;
  no_damage_direct_hits_received: number;
  max_frags: number;
  shots: number;
  radio_assisted_damage: number;
  avg_damage_assisted_stun: number;
  tanking_factor: number;
}

export interface WotPlayerPersonalData {
  last_battle_time: number;
  account_id: number;
  created_at: number;
  private?: WotPlayerPrivateData;
  global_rating?: number;
  statistics: {
    clan: WotPlayerStatistics;
    all: WotPlayerStatistics;
    regular_team: WotPlayerStatistics;
    company: WotPlayerStatistics;
    stronghold_skirmish: WotPlayerStatistics;
    stronghold_defense: WotPlayerStatistics;
    historical: WotPlayerStatistics;
    team: WotPlayerStatistics;
    trees_cut: number;
    frags: object; // Object.keys(playerInfo.statistics.frags) <- Tanks Ids; playerInfo.statistics.frags[key] <- Count
  };
}
