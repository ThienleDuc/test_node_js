import React from "react";
import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  return (
    <>
        <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
            {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
                <li
                key={index}
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
                aria-current={isLast ? "page" : undefined}
                >
                {!isLast && item.link ? (
                    <Link to={item.link} className="breadcrumb-link">
                    {item.name}
                    </Link>
                ) : (
                    item.name
                )}
                </li>
            );
            })}
        </ol>
        </nav>
    </>
  );
}

export default Breadcrumb;
