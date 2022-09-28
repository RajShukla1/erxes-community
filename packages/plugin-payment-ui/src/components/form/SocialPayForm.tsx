import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';

import Button from '@erxes/ui/src/components/Button';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Form from '@erxes/ui/src/components/form/Form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import React from 'react';

import { __ } from '@erxes/ui/src/utils';
import { SettingsContent } from './styles';
import { ISocialPayConfig, IPaymentConfigDocument } from 'types';

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  paymentConfig?: IPaymentConfigDocument;
};

type State = {
  paymentConfigName: string;
  inStoreSPTerminal: string;
  inStoreSPKey: string;
  inStoreSPUrl: string;
  pushNotification: string;
};

class SocialPayConfigForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { paymentConfig } = this.props;
    const { name, config } = paymentConfig || ({} as IPaymentConfigDocument);
    const { inStoreSPTerminal, inStoreSPKey, inStoreSPUrl, pushNotification } =
      config || ({} as ISocialPayConfig);

    this.state = {
      paymentConfigName: name || '',
      inStoreSPTerminal: inStoreSPTerminal || '',
      inStoreSPKey: inStoreSPKey || '',
      inStoreSPUrl: inStoreSPUrl || '',
      pushNotification: pushNotification || ''
    };
  }

  generateDoc = (values: {
    paymentConfigName: string;
    inStoreSPTerminal: string;
    inStoreSPKey: string;
    inStoreSPUrl: string;
    pushNotification: string;
  }) => {
    const { paymentConfig } = this.props;
    const generatedValues = {
      name: values.paymentConfigName,
      type: 'socialPay',
      status: 'active',
      config: {
        inStoreSPTerminal: values.inStoreSPTerminal,
        inStoreSPKey: values.inStoreSPKey,
        inStoreSPUrl: values.inStoreSPUrl,
        pushNotification: values.pushNotification
      }
    };

    return paymentConfig
      ? { ...generatedValues, id: paymentConfig._id }
      : generatedValues;
  };

  onChangeConfig = (code: string, e) => {
    this.setState({ [code]: e.target.value } as any);
  };

  renderItem = (key: string, title: string, description?: string) => {
    const value = this.state[key]
      ? this.state[key]
      : key === 'inStoreSPUrl'
      ? 'https://instore.golomtbank.com/'
      : '';

    return (
      <FormGroup>
        <ControlLabel>{title}</ControlLabel>
        <FormControl
          defaultValue={value}
          onChange={this.onChangeConfig.bind(this, key)}
          value={value}
        />
      </FormGroup>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const { renderButton, closeModal } = this.props;
    const { isSubmitted } = formProps;
    const {
      paymentConfigName,
      inStoreSPTerminal,
      inStoreSPKey,
      inStoreSPUrl,
      pushNotification
    } = this.state;

    const values = {
      paymentConfigName,
      inStoreSPTerminal,
      inStoreSPKey,
      inStoreSPUrl,
      pushNotification
    };

    return (
      <>
        <SettingsContent title={__('General settings')}>
          {this.renderItem('paymentConfigName', 'Name')}
          {this.renderItem('inStoreSPTerminal', 'Terminal')}
          {this.renderItem('inStoreSPKey', 'Key')}
          {this.renderItem('inStoreSPUrl', 'InStore SocialPay url')}
          {this.renderItem(
            'pushNotification',
            'Push notification url with /pushNotif'
          )}
        </SettingsContent>

        <ModalFooter>
          <Button
            btnStyle="simple"
            type="button"
            onClick={closeModal}
            icon="times-circle"
          >
            Cancel
          </Button>
          {renderButton({
            name: 'socialPay',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal
          })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <Form renderContent={this.renderContent} />;
  }
}

export default SocialPayConfigForm;
