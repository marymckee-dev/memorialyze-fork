import { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps<T extends ElementType = 'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  as?: T;
}

type ButtonComponentProps<T extends ElementType> = ButtonProps<T> & 
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>;

const Button = <T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  children,
  as,
  className = '',
  ...props
}: ButtonComponentProps<T>) => {
  const Component = as || 'button';
  
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500',
    outline: 'border border-white hover:bg-white/10 text-white focus:ring-white',
    ghost: 'hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Button;