import React from "react";

/* =========================================================
   BUTTON
========================================================= */

export function Btn({
                        children,
                        onClick,
                        type = "button",
                        disabled = false,
                        variant = "primary",
                        size = "md",
                        className = "",
                        style = {},
                    }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={style}
            className={`
        wm-btn
        wm-btn--${variant}
        wm-btn--${size}
        ${className}
      `}
        >
            {children}
        </button>
    );
}

/* =========================================================
   INPUT
========================================================= */

export function Input({
                          label,
                          error,
                          className = "",
                          ...props
                      }) {
    return (
        <div className="wm-form-group">
            {label && (
                <label className="wm-label">
                    {label}
                </label>
            )}

            <input
                {...props}
                className={`
          wm-input
          ${error ? "wm-input--error" : ""}
          ${className}
        `}
            />

            {error && (
                <span className="wm-field-error">
          {error}
        </span>
            )}
        </div>
    );
}

/* =========================================================
   AVATAR
========================================================= */

export function Avatar({
                           src,
                           alt = "Avatar",
                           size = "md",
                           color = "purple",
                           initials = "U",
                           className = "",
                       }) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`
          wm-avatar
          wm-avatar--${size}
          ${className}
        `}
            />
        );
    }

    return (
        <div
            className={`
        wm-avatar
        wm-avatar--${size}
        wm-avatar--${color}
        ${className}
      `}
        >
            {initials}
        </div>
    );
}

/* =========================================================
   BADGE
========================================================= */

export function Badge({
                          children,
                          variant = "neutral",
                          className = "",
                      }) {
    return (
        <span
            className={`
        wm-badge
        wm-badge--${variant}
        ${className}
      `}
        >
      {children}
    </span>
    );
}

/* =========================================================
   SPINNER
========================================================= */

export function Spinner({
                            size = "md",
                            className = "",
                        }) {
    return (
        <div
            className={`
        wm-spinner
        wm-spinner--${size}
        ${className}
      `}
        />
    );
}

/* =========================================================
   EMPTY STATE
========================================================= */

export function EmptyState({
                               emoji = "📦",
                               title = "Nada encontrado",
                               description = "",
                               action = null,
                           }) {
    return (
        <div className="wm-empty">
            <div className="wm-empty__icon">
                {emoji}
            </div>

            <div className="wm-empty__title">
                {title}
            </div>

            {description && (
                <div className="wm-empty__desc">
                    {description}
                </div>
            )}

            {action}
        </div>
    );
}

/* =========================================================
   STARS
========================================================= */

export function Stars({
                          rating = 5,
                      }) {
    const rate = Number(rating);
    const full = Math.floor(rate);

    return (
        <div className="wm-stars">
            {[1, 2, 3, 4, 5].map((n) => (
                <span
                    key={n}
                    className={
                        n <= full
                            ? "wm-star"
                            : "wm-star wm-star--empty"
                    }
                >
          ★
        </span>
            ))}

            <span className="wm-stars__val">
        {rating}
      </span>
        </div>
    );
}

/* =========================================================
   ALERT
========================================================= */

export function Alert({
                          children,
                          variant = "info",
                          className = "",
                      }) {
    return (
        <div
            className={`
        wm-alert
        wm-alert--${variant}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

/* =========================================================
   CARD
========================================================= */

export function Card({
                         children,
                         className = "",
                         variant = "",
                         clickable = false,
                         onClick,
                     }) {
    return (
        <div
            onClick={onClick}
            className={`
        wm-card
        ${variant ? `wm-card--${variant}` : ""}
        ${clickable ? "wm-card--clickable" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

/* =========================================================
   CARD HEADER
========================================================= */

export function CardHeader({
                               title,
                               children,
                               className = "",
                           }) {
    return (
        <div
            className={`
        wm-card__header
        ${className}
      `}
        >
            {title && (
                <div className="wm-card__title">
                    {title}
                </div>
            )}

            {children}
        </div>
    );
}

/* =========================================================
   CARD TITLE
========================================================= */

export function CardTitle({
                              children,
                              className = "",
                          }) {
    return (
        <div
            className={`
        wm-card__title
        ${className}
      `}
        >
            {children}
        </div>
    );
}

/* =========================================================
   CARD BODY
========================================================= */

export function CardBody({
                             children,
                             className = "",
                         }) {
    return (
        <div
            className={`
        wm-card__body
        ${className}
      `}
        >
            {children}
        </div>
    );
}

/* =========================================================
   DIVIDER
========================================================= */

export function Divider({
                            className = "",
                        }) {
    return (
        <hr
            className={`
        wm-divider
        ${className}
      `}
        />
    );
}