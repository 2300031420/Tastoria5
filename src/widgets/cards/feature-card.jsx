import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function FeatureCard({ color, title, icon, description }) {
  return (
    <Card className="rounded-lg shadow-lg shadow-gray-500/10 h-[400px] transform hover:scale-105 transition-all duration-300">
      <CardBody className="p-8">
        <div className={`mb-6 grid h-20 w-20 place-items-center rounded-lg bg-${color} p-4`}>
          {icon}
        </div>
        <Typography variant="h3" className="mb-4 font-bold">
          {title}
        </Typography>
        <Typography className="font-normal text-lg text-blue-gray-600">
          {description}
        </Typography>
      </CardBody>
    </Card>
  );
}

FeatureCard.defaultProps = {
  color: "blue",
};

FeatureCard.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
};

FeatureCard.displayName = "/src/widgets/layout/feature-card.jsx";

export default FeatureCard;
