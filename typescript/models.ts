module Wodify.Models {

  export interface IWodComponents {
    name: string;
    description: string;
  }

  export interface IWodPerfomancePartsTime {
    time_minutes: number;
    time_seconds: number;
    total_seconds: number;
  }

  export interface IWodPerfomancePartsWeight {
    weight: number;
    units: string;
    rounds?: number;
    reps?: number;
  }

  export interface IWodPerfomancePartsReps {
    reps: number;
    units: string;
  }

  export interface IWodPerfomancePartsRoundsAndReps {
    rounds: number;
    reps: number;
    units: string;
  }

  export interface IAthleteBadges {
    isPr: boolean;
    prDetails: string;
    isRx: boolean;
    isRxPlus: boolean;
  }

  export interface IAthleteSocial {
    likesCount: number;
    commentsCount: number;
  }

  export interface IAthlete {
    name: string;
    avatar: string;
    rank: number;
    class_info: string;
    performance_string: string;
    performance_parts: IWodPerfomancePartsTime | IWodPerfomancePartsWeight | IWodPerfomancePartsReps,
    performance_details: string[],
    comment: string;
    pr: boolean;
    pr_details: string;
    rx: boolean;
    rx_plus: boolean;
    social_likes: number;
    social_comments: number;
  }

  export interface IWodResults {
    males: IAthlete[];
    females: IAthlete[];
  }

  export interface IWodData {
    date: string;
    name: string;
    comment: string;
    components: IWodComponents[],
    results_measure: string;
    results: IWodResults;
  }
}