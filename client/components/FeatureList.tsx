import { CheckIcon } from "@heroicons/react/outline";

export default function FeatureList({ features }) {
  return features.map((feature) => (
    <div key={feature.name} className="relative">
      <div>
        <CheckIcon
          className="absolute h-6 w-6 text-green-500"
          aria-hidden="true"
        />
        <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
          {feature.name}
        </p>
      </div>
    </div>
  ));
}
