import { Flex, FlexItem, Form } from "@patternfly/react-core";
import type { FormEvent, VoidFunctionComponent } from "react";
import { useCallback } from "react";
import type { FieldSizeProps } from "./components";
import {
  ModalAlertsStandardPlan,
  FormAlerts,
  InstanceInfoSkeleton,
  InstanceInfo,
  FieldInstanceName,
  FieldCloudProvider,
  FieldCloudRegion,
  FieldAZ,
  FieldSize,
} from "./components";
import { useStandardPlanMachine } from "./machines";

export type StandardInstanceFormProps = {
  formId: string;
  onClickContactUs: () => void;
  onLearnHowToAddStreamingUnits: () => void;
  onLearnMoreAboutSizes: () => void;
  onClickQuickStart: () => void;
};

export const StandardInstanceForm: VoidFunctionComponent<
  StandardInstanceFormProps
> = ({
  formId,
  onClickContactUs,
  onLearnHowToAddStreamingUnits,
  onLearnMoreAboutSizes,
  onClickQuickStart,
}) => {
  const { capabilities, selectedSize, error, onCreate } =
    useStandardPlanMachine();

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onCreate();
    },
    [onCreate]
  );

  return (
    <>
      <ModalAlertsStandardPlan
        instanceAvailability={capabilities.instanceAvailability}
        onClickContactUs={onClickContactUs}
      />

      <Flex
        direction={{ default: "column", lg: "row" }}
        alignItems={{ lg: "alignItemsFlexStart" }}
      >
        <FlexItem flex={{ default: "flex_2" }}>
          <FormAlerts error={error} onClickContactUS={onClickContactUs} />
          <Form onSubmit={onSubmit} id={formId}>
            <ConnectedFieldInstanceName />
            <ConnectedFieldCloudProvider />
            <ConnectedFieldCloudRegion />
            <ConnectedFieldAZ />
            <ConnectedFieldSize
              onLearnHowToAddStreamingUnits={onLearnHowToAddStreamingUnits}
              onLearnMoreAboutSizes={onLearnMoreAboutSizes}
            />
          </Form>
        </FlexItem>
        <FlexItem
          flex={{ default: "flex_1" }}
          className="mas--CreateKafkaInstance__sidebar"
        >
          {selectedSize === undefined ? (
            <InstanceInfoSkeleton
              isTrial={false}
              onClickQuickStart={onClickQuickStart}
            />
          ) : (
            <InstanceInfo
              isTrial={false}
              trialDurationInHours={undefined}
              ingress={selectedSize.ingress}
              egress={selectedSize.egress}
              storage={selectedSize.storage}
              maxPartitions={selectedSize.maxPartitions}
              connections={selectedSize.connections}
              connectionRate={selectedSize.connectionRate}
              messageSize={selectedSize.messageSize}
              onClickQuickStart={onClickQuickStart}
              streamingUnits={selectedSize.displayName}
            />
          )}
        </FlexItem>
      </Flex>
    </>
  );
};

export const ConnectedFieldInstanceName: VoidFunctionComponent = () => {
  const {
    form,
    isNameTaken,
    isNameInvalid,
    isNameEmpty,
    isNameError,
    isFormEnabled,
    setName,
  } = useStandardPlanMachine();

  return (
    <FieldInstanceName
      value={form.name || ""}
      validity={
        isNameTaken
          ? "taken"
          : isNameInvalid
          ? "invalid"
          : isNameEmpty && isNameError
          ? "required"
          : "valid"
      }
      isDisabled={!isFormEnabled}
      onChange={setName}
    />
  );
};

export const ConnectedFieldCloudProvider: VoidFunctionComponent = () => {
  const { form, capabilities, isProviderError, isFormEnabled, setProvider } =
    useStandardPlanMachine();

  return (
    <FieldCloudProvider
      isValid={!isProviderError}
      providers={capabilities.availableProviders || []}
      value={form.provider}
      isDisabled={!isFormEnabled}
      onChange={setProvider}
    />
  );
};

export const ConnectedFieldCloudRegion: VoidFunctionComponent = () => {
  const {
    form,
    selectedProvider,
    selectedSize,
    isRegionError,
    isFormEnabled,
    capabilities,
    error,
    setRegion,
  } = useStandardPlanMachine();

  return (
    <FieldCloudRegion
      validity={
        isRegionError
          ? "required"
          : error === "region-unavailable" ||
            capabilities.instanceAvailability === "regions-unavailable"
          ? "region-unavailable"
          : "valid"
      }
      regions={selectedProvider?.regions}
      value={form.region}
      isDisabled={!isFormEnabled}
      isSizeUnavailable={selectedSize?.isDisabled || false}
      onChange={setRegion}
    />
  );
};

export const ConnectedFieldAZ: VoidFunctionComponent = () => {
  const { isFormEnabled } = useStandardPlanMachine();

  return (
    <FieldAZ
      validity={"valid"}
      options={"multi"}
      value={"multi"}
      isDisabled={!isFormEnabled}
      onChange={() => false} // AZ is defined by the backend, we just visualize the value here
    />
  );
};

export const ConnectedFieldSize: VoidFunctionComponent<
  Pick<
    FieldSizeProps,
    "onLearnHowToAddStreamingUnits" | "onLearnMoreAboutSizes"
  >
> = ({ onLearnHowToAddStreamingUnits, onLearnMoreAboutSizes }) => {
  const {
    form,
    sizes,
    isSizeOverQuota,
    isSizeDisabled,
    isSizeError,
    isSizeLoadingError,
    isFormEnabled,
    isLoadingSizes,
    isLoading,
    setSize,
  } = useStandardPlanMachine();

  return (
    <FieldSize
      value={form.size?.quota || 1}
      sizes={sizes}
      //TODO remainingQuota={capabilities.remainingQuota || 0}
      remainingQuota={0}
      isDisabled={!isFormEnabled || sizes === undefined}
      isLoading={isLoading || isLoadingSizes}
      isError={isSizeError}
      isLoadingError={isSizeLoadingError}
      validity={
        isSizeOverQuota ? "over-quota" : isSizeDisabled ? "required" : "valid"
      }
      onChange={setSize}
      onLearnHowToAddStreamingUnits={onLearnHowToAddStreamingUnits}
      onLearnMoreAboutSizes={onLearnMoreAboutSizes}
    />
  );
};
