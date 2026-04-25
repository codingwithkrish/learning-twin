import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, title, subtitle, icon: Icon, glow = false }) => {
  return (
    <div className={clsx(
      "glass-card p-6 flex flex-col",
      glow && "shadow-xl shadow-primary-indigo/5",
      className
    )}>
      {(title || Icon) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {title && <h3 className="font-semibold text-lg">{title}</h3>}
            {subtitle && <p className="text-sm text-on-surface/50">{subtitle}</p>}
          </div>
          {Icon && (
            <div className="w-10 h-10 bg-surface-highest rounded-lg flex items-center justify-center text-primary-indigo">
              <Icon size={20} />
            </div>
          )}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Card;
