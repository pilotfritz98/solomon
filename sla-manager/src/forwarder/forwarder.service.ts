import { Injectable, Logger } from '@nestjs/common';
import { ConnectorService } from 'src/models/connector-service';
import { CwConnectorService } from 'src/connector-cloudwatch/cw.service';
import { K8sConnectorService } from 'src/connector-kubernetes/k8s.service';
import SloRule from 'src/models/slo-rule.model';
import { DeploymentEnvironment } from 'src/models/slo-rule.model';
import { Target } from 'src/models/target.model';
import { SolomonInstanceConfig } from 'src/models/config.model';

/**
 * The forwarder service contains the logic for **forwarding the requests** (e.g. getRules, addRule) 
 * that arrive at the app controller **to the respective plugins** that are used to connect 
 * to **different monitoring tools** (e.g. CloudWatch, Prometheus).
 */
@Injectable()
export class ForwarderService implements ConnectorService{
    private readonly logger = new Logger(ForwarderService.name);
    // private config: SolomonInstanceConfig;

    constructor(private cwConnector: CwConnectorService,
                private k8sConnector: K8sConnectorService) {}

    // setSelectedDeploymentEnvironment(selection: DeploymentEnvironment[]) {
    //     // TODO: allow multiple selections?
    //     this.config.deploymentEnvironment = selection[0] as DeploymentEnvironment;
    //     this.logger.log('Selected the following deployment environment:');
    //     this.logger.log(this.config.deploymentEnvironment);
    // }

    // setConfig(config: SolomonInstanceConfig) {
    //     this.config = config;
    //     this.logger.log('Set Config');
    //     return this.config;
    // }

    // getConfig() {
    //     return this.config;
    // }

    getRules(deploymentEnvironment: DeploymentEnvironment): Promise<SloRule[]> {
        switch (deploymentEnvironment) {
            case DeploymentEnvironment.AWS:
                return this.cwConnector.getRules();
            case DeploymentEnvironment.KUBERNETES:
                this.logger.log('not yet implemented ...')
                return null;
                // return this.k8sPluginService.getRules();
        }
    }

    getTargets(deploymentEnvironment: DeploymentEnvironment): Promise<Target[]> {
        switch (deploymentEnvironment) {
            case DeploymentEnvironment.AWS:
                return this.cwConnector.getTargets();
            case DeploymentEnvironment.KUBERNETES:
                this.logger.log('not yet implemented ...')
                // return this.k8sConnector.getTargets();
        }
    }

    addRule(rule: SloRule): Promise<boolean> {
        switch (rule.deploymentEnvironment) {
            case DeploymentEnvironment.AWS:
                return this.cwConnector.addRule(rule);
            case DeploymentEnvironment.KUBERNETES:
                // return this.k8sPluginService.addRule(rule);
        }
    }

    updateRule(rule: SloRule): Promise<boolean> {
        switch (rule.deploymentEnvironment) {
            case DeploymentEnvironment.AWS:
                return this.cwConnector.updateRule(rule);
            case DeploymentEnvironment.KUBERNETES:
                // return this.k8sPluginService.updateRule(rule);
        }
    }

    deleteRule(name: string, env: DeploymentEnvironment): Promise<boolean> {
        switch (env) {
            case DeploymentEnvironment.AWS:
                return this.cwConnector.deleteRule(name);
            case DeploymentEnvironment.KUBERNETES:
                // return this.k8sPluginService.deleteRule(rule);
        }
    }


}
