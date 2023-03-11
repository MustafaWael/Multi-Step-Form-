import { useState } from 'react';
import { useForm } from 'react-hook-form';

function App() {
  const { Step, next, back, goTo, isFirstStep, isLastStep } = useMultiStepForm([
    Email,
    Password,
    UserInfo,
    Greeting,
  ]);

  const { register, handleSubmit, reset, ...rest } = useForm();

  const onSubmit = (data) => {
    next();
    console.log(data);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    reset();
    goTo(0);
  };

  return (
    <>
      <h1>Signup Form</h1>
      <div className="form-wrapper">
        <Form id="signup" onSubmit={handleSubmit(onSubmit)}>
          {<Step register={register} {...rest} />}
        </Form>

        <Controllers
          back={back}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          handleFinish={handleFinish}
        />
      </div>
    </>
  );
}

export default App;

// Form Component
const Form = ({ id = '', children, ...props }) => {
  return (
    <form id={id} {...props}>
      {children}
    </form>
  );
};

// Steps Components //
const Email = ({ register = () => {}, formState: { errors } }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          {...register('email', { required: true })}
        />
      </div>
      {errors?.email && <p>Email is required</p>}
    </>
  );
};

const Password = ({ register = () => {}, formState: { errors } }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          {...register('password', { required: true })}
        />
      </div>
      {errors?.password && <p>Password is required</p>}
    </>
  );
};

const UserInfo = ({ register = () => {}, formState: { errors } }) => {
  return (
    <div>
      <div className="form-group">
        <label htmlFor="fname">First Name *</label>
        <input
          type="text"
          id="fname"
          {...register('fname', { required: true })}
        />
        {errors.fname && <p>First Name is required.</p>}
      </div>

      <div className="form-group">
        <label htmlFor="lname">Last Name *</label>
        <input
          type="text"
          id="lname"
          {...register('lname', { required: true })}
        />
        {errors.lname && <p>Last Name is required.</p>}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input type="number" id="age" {...register('age')} />
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input type="text" id="country" {...register('country')} />
      </div>
    </div>
  );
};

const Greeting = ({ getValues = () => {} }) => {
  const name = `${getValues('fname')} ${getValues('lname')}`;
  return <p>Thanks {name}</p>;
};

// Form Controllers Component
const Controllers = ({ back, isFirstStep, isLastStep, handleFinish }) => {
  return (
    <div className="form-controllers">
      <button onClick={back} disabled={isFirstStep}>
        Back
      </button>
      <button
        form="signup"
        type="submit"
        onClick={isLastStep ? handleFinish : null}
      >
        {isLastStep ? 'Finish' : 'Next Step'}
      </button>
    </div>
  );
};

// A hook that accept a array of components (setps)
// return the all functionality of the multi step form
export const useMultiStepForm = (steps) => {
  // States
  const [currentStep, setCurrentStep] = useState(0);

  // Get the next step from the array
  const next = () => {
    setCurrentStep((prev) => {
      if (prev < steps.length - 1) return prev + 1;
      return prev;
    });
  };

  // Get the previous step in the steps array
  const back = () => {
    setCurrentStep((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  };

  // Go to any step
  const goTo = (index) => {
    setCurrentStep(index);
  };

  return {
    next,
    back,
    goTo,
    Step: steps[currentStep],
    currentStep,
    isLastStep: currentStep === steps.length - 1,
    isFirstStep: currentStep === 0,
  };
};
