import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import {
  IRiskAssessmentsConfigModel,
  loadRiskAssessmentsConfig
} from './models/Configs';
import { IRiskFormSubmissionDocument } from './models/definitions/confimity';
import {
  IIndicatorsGroupsDocument,
  IRiskAssessmentsConfigsDocument,
  IRiskIndicatorsDocument
} from './models/definitions/indicator';
import { IOperationsDocument } from './models/definitions/operations';
import {
  IRiskAssessmentIndicatorsDocument,
  IRiskAssessmentsDocument,
  riskAssessmentIndicatorsGroupsSchema,
  riskAssessmentIndicatorsSchema
} from './models/definitions/riskassessment';
import {
  IRiskFormSubmissionModel,
  loadRiskFormSubmissions
} from './models/FormSubmissions';
import { IOperationsModel, loadOperations } from './models/Operations';
import {
  IRiskAssessmentsModel,
  loadRiskAssessments
} from './models/RiskAssessment';
import {
  IIndicatorsGroupsModel,
  IRiskIndicatorsModel,
  loadIndicatorsGroups,
  loadRiskIndicators
} from './models/RiskIndicator';

export interface IModels {
  RiskIndicators: IRiskIndicatorsModel;
  RiskAssessments: IRiskAssessmentsModel;
  RiskAssessmentIndicators: Model<any>;
  RiskAssessmentGroups: Model<any>;
  RiksFormSubmissions: IRiskFormSubmissionModel;
  RiskAssessmentsConfigs: IRiskAssessmentsConfigModel;
  Operations: IOperationsModel;
  IndicatorsGroups: IIndicatorsGroupsModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  models = {} as IModels;

  models.RiskIndicators = db.model<
    IRiskIndicatorsDocument,
    IRiskIndicatorsModel
  >('risk_indicator', loadRiskIndicators(models, subdomain));

  models.RiskAssessments = db.model<
    IRiskAssessmentsDocument,
    IRiskAssessmentsModel
  >('risk_assessments', loadRiskAssessments(models, subdomain));

  models.RiskAssessmentIndicators = db.model<
    IRiskAssessmentIndicatorsDocument,
    any
  >('risk_assessment_indicators', riskAssessmentIndicatorsSchema);
  models.RiskAssessmentGroups = db.model<any, any>(
    'risk_assessment_groups',
    riskAssessmentIndicatorsGroupsSchema
  );

  models.RiksFormSubmissions = db.model<
    IRiskFormSubmissionDocument,
    IRiskFormSubmissionModel
  >('risk_form_submissions', loadRiskFormSubmissions(models, subdomain));

  models.RiskAssessmentsConfigs = db.model<
    IRiskAssessmentsConfigsDocument,
    IRiskAssessmentsConfigModel
  >('risk_assessments_configs', loadRiskAssessmentsConfig(models, subdomain));

  models.IndicatorsGroups = db.model<
    IIndicatorsGroupsDocument,
    IIndicatorsGroupsModel
  >('risk_indicators_groups', loadIndicatorsGroups(models, subdomain));

  models.Operations = db.model<IOperationsDocument, IOperationsModel>(
    'operations',
    loadOperations(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
