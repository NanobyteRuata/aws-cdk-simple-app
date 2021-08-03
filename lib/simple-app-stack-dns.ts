import { Certificate, CertificateValidation, DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IPublicHostedZone, PublicHostedZone } from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

interface SimpleAppStackDnsProps extends cdk.StackProps {
    dnsName: string
}

export class SimpleAppStackDns extends cdk.Stack {
    public readonly hostedZone: IPublicHostedZone;
    public readonly certificate: ICertificate;

    constructor(scope: cdk.Construct, id: string, props: SimpleAppStackDnsProps) {
        super(scope,id,props);

        this.hostedZone = new PublicHostedZone(this, 'SimpleAppHostedZone', {
            zoneName: props.dnsName
        });

        this.certificate = new DnsValidatedCertificate(this, 'SimpleAppCertificateManager', {
            domainName: props.dnsName,
            hostedZone: this.hostedZone,
            region: 'us-east-1'
        });
    }
}