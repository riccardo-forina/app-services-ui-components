import { Popover, ProgressStep, ProgressStepper } from "@patternfly/react-core";
import React, {
  FunctionComponent,
  useState,
  VoidFunctionComponent,
} from "react";

type KafkaStatusPopoverProps = {
  shouldStartOpen?: boolean;
} & KafkaStatusPopoverBodyProps;

export const KafkaStatusPopover: FunctionComponent<KafkaStatusPopoverProps> = ({
  shouldStartOpen = false,
  currentState,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(shouldStartOpen);

  return (
    <Popover
      headerContent="Creating instance"
      bodyContent={<KafkaStatusPopoverBody currentState={currentState} />}
      isVisible={isVisible}
      shouldOpen={() => setIsVisible(true)}
      shouldClose={() => setIsVisible(false)}
    >
      {children}
    </Popover>
  );
};

type States = "pending" | "provisioning" | "preparing" | "ready";

type KafkaStatusPopoverBodyProps = {
  currentState: States;
};
export const KafkaStatusPopoverBody: VoidFunctionComponent<
  KafkaStatusPopoverBodyProps
> = ({ currentState }) => {
  const order: States[] = ["pending", "provisioning", "preparing", "ready"];
  const currentStep = order.findIndex((v) => v === currentState);
  console.log(currentStep);
  return (
    <div>
      <p>This will be ready shortly.</p>
      <p>0 of 443 steps completed</p>
      <ProgressStepper isVertical>
        <ProgressStep
          variant={currentStep === 0 ? "info" : "success"}
          isCurrent={currentState === "pending"}
          description="This is the first thing to happen"
          id="vertical-desc-step1"
          titleId="vertical-desc-step1-title"
          aria-label="completed step, step with success"
        >
          Pending
        </ProgressStep>
        <ProgressStep
          variant={
            currentStep === 1 ? "info" : currentStep > 1 ? "success" : "default"
          }
          isCurrent={currentState === "provisioning"}
          description="This is the second thing to happen"
          id="vertical-desc-step2"
          titleId="vertical-desc-step2-title"
          aria-label="current step, step with info"
        >
          Provisioning
        </ProgressStep>
        <ProgressStep
          variant={
            currentStep === 2 ? "info" : currentStep > 2 ? "success" : "default"
          }
          isCurrent={currentState === "preparing"}
          description="This is the last thing to happen"
          id="vertical-desc-step3"
          titleId="vertical-desc-step3-title"
          aria-label="pending step"
        >
          Preparing
        </ProgressStep>
      </ProgressStepper>
    </div>
  );
};
